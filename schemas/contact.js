const z = require('zod')

const dataSchema = z.object({
  name: z.string({
    invalid_type_error: 'Name must be a string',
    required_error: 'Name is required.'
  }),
  email: z
    .string({
      invalid_type_error: 'Email must be a string',
      required_error: 'Email is required.'
    })
    .email({ message: 'Invalid email address' }),
  message: z.string({
    invalid_type_error: 'Message must be a string',
    required_error: 'Message is required.'
  })
})

function validateContact (input) {
  return dataSchema.safeParse(input)
}

module.exports = {
  validateContact
}
