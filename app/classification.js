const express = require('express')
const app = express.Router()

const init = connection => {
    app.use((req,res,next) => {
        if(!req.session.user){
            res.redirect('/login')
        }else{
            next()
        }
    })
    app.get('/', async(req,res) => {
        const query = `select groups.id,
							  groups.name,
							  sum(guessings.score) as score
					   from groups
					   left join guessings on (guessings.group_id = groups.id)
					   group by guessings.group_id
					   order by score DESC`
        const [rows] = await connection.execute(query)
        res.render('classification', {groups: rows})
    })
    return app
  }

  module.exports = init