const express = require('express')
const app = express.Router()

const crpt = require('./crypto')


const init = connection => {
    app.get('/',async (req,res) => {
        const query = `select groups.id,
							  groups.name,
                			  sum(guessings.score) as score
					   from groups
					   left join guessings on (guessings.group_id = groups.id)
					   group by guessings.group_id
					   order by score DESC`
            const [rows] = await connection.execute(query)
        res.render('home', {groups: rows})
    })
    app.get('/login',(req,res) => {
        res.render('login', { error: false })
    })
    app.get('/logout',(req,res) => {
        req.session.destroy(err => {
            res.redirect('/')
        })
    })
    app.post('/login', async(req,res) => {
        const [rows,fields] = await connection.execute('select * from users where email = ?',[req.body.email])
        if(rows.length === 0){
            res.render('login',{error:'Nome do usuário e/ou senha inválidos.'})
        }else{
            if(crpt.decrypt(rows[0].passwd) === req.body.passwd){
                const userDB = rows[0]
                const user = {
                    id: userDB.id,
                    name: userDB.name,
                    role: userDB.role
                }
                req.session.user = user
                res.redirect('/')
            }else{
                res.render('login',{error:'Nome do usuário e/ou senha inválidos.'})
            }
        }

    })
    app.get('/new-account',(req,res) => {
        res.render('new-account', { error: false })
    })
    app.post('/new-account',async(req,res) => {
        const [rows,fields] = await connection.execute('select * from users where email = ?',[req.body.email])
        if(rows.length === 0){
            //inserir
            const { name, email, passwd } = req.body
            const [inserted,insertFields] = await connection.execute('insert into users (name, email, passwd, role) values(?,?,?,?)', [
                name, email, crpt.crypt(passwd), 'user'
            ])
            const user = {
                id: inserted.insertId,
                name: name,
                role: 'user'
            }
            req.session.user = user
            res.redirect('/')
        }else{ 
            res.render('new-account', {
                error: 'Usuário já existe'
            })
        }        
    })
    return app
}

module.exports = init