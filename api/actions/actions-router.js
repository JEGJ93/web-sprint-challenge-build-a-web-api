// Write your "actions" router here!
const express = require('express');

const Actions = require('../actions/actions-model')
const router = express.Router();

router.use((req, res, next) => {
    console.log('in the actions router');
    next();
  })

router.get('/', (req, res) => {
    Actions.get()
    .then(action => {
      res.status(200).json(action);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the actions',
      });
    });
  });

router.post('/:id', validateAction, (req, res) => {
    Actions.insert(req.action)
    .then(action => {
      res.status(201).json(action);
    })
    .catch(err => {
      res.status(500).json({message: "Error adding an action", err});
    })
});

router.put('/:id', validateActionId, validateAction, (req, res) => {
    Actions.update(req.params.id, req.body)
  .then(action => {
    res.status(200).json(`Action ${action.notes} Updated`);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: 'There was an error updating action'})
  })
})

router.delete('/:id', validateActionId, (req, res) => {
    Actions.remove(req.params.id)
    .then(count => {
    res.status(200).json({ message: `${count} account deleted`})
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'Error removing the action',
    });
  });
})




function validateActionId(req, res, next) {
    const { id } = req.params;
    Actions.get(id)
    .then(action => {
      if(action) {
        next(); 
      } else {
        next({code: 400, message: "Invalid action ID"}); 
      }
    })
    .catch(err => {
      console.log(err);
      next({code: 500, message: "Failed to process request", err});
    })
  }
  
  
  
  
  
  function validateAction(req, res, next) {
    if(req.body) {
      if(req.body.notes && req.body.description) {
        const action = {...req.body, project_id: req.params.id};
        req.action = action;
        next();
      } else {
        next({code: 400, message: "Missing required note field"});
      }
    } else {
      next({code: 400, message: "Missing action data"});
    }
  }
  
//   function validateProjectPost(req, res, next) {
//     if(req.body && Object.keys(req.body).length > 0) {
//       if(req.body.text) {
//         next();
//       } else {
//         next({code: 404, message: "Please include text"});
//       }
//     } else {
//       next({code: 404, message: "Please include a request body"});
//       // res.status(500).json({message: 'please include a request body'})
//     }
//   };

module.exports = router;