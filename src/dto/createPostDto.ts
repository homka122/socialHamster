import Joi from 'joi';

const createPostDto = Joi.object({
  text: Joi.string().max(3000).trim().required(),
});

export { createPostDto };
