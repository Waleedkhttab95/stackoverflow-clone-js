const db = require('./db')

;(async () => {
  try {
 
    // knex ORM commands to create DB tables
    // *************************************************

    
    await db.schema.dropTableIfExists('questions')
    await db.schema.dropTableIfExists('answer')
    await db.schema.dropTableIfExists('tag')



    await db.schema.withSchema('public').createTable('questions', (table) => {
      table.increments('id')
      table.string('question')
      table.specificType('comments' , 'text ARRAY')
      // table.specificType('tag_id' , 'integer ARRAY')
      // .unsigned()
      // .references('tag.id');
    })




    await db.schema.withSchema('public').createTable('answer', (table) => {
      table.increments('id')
      table.string( 'answer')
      table.integer('question_id')
      .unsigned()
      .references('questions.id');
      table.specificType('comments', 'text ARRAY')

    })


    await db.schema.withSchema('public').createTable('tag', (table) => {
      table.increments('id')
      table.string('tag_name')
      table.integer('questions_id')
      .unsigned()
      .references('questions.id');;

    })


    console.log('Created DB!')
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()
