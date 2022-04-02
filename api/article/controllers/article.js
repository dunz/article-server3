'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const {sanitizeEntity} = require('strapi-utils')
module.exports = {
  async create(ctx) {
    ctx.request.body.user = ctx.state.user.id;
    const entity = await strapi.services.article.create(ctx.request.body)
    return sanitizeEntity(entity, {model: strapi.models.article})
  },
  async update(ctx) {
    const { id } = ctx.params;
    const article = await strapi.services.article.findOne({id})

    if(!article) {
      return ctx.throw(404)
    }
    if(ctx.request.body.user) {
      return ctx.throw(400, 'user field cannot be changed')
    }
    if(ctx.state.user.id !== article.user.id) {
      return ctx.unauthorized(`You can't update this entity`)
    }
    const entity = await strapi.services.article.update({id}, ctx.request.body)
    return sanitizeEntity(entity, {model: strapi.models.article});
  },
  async delete(ctx) {
    const { id } = ctx.params;
    const article = await strapi.services.article.findOne({id})

    if(!article) {
      return ctx.throw(404)
    }
    if(ctx.state.user.id !== article.user?.id) {
      return ctx.unauthorized(`You can't remove this entity`)
    }
    await strapi.services.article.delete({id})
    ctx.status = 204
  }
};
