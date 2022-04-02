'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const {sanitizeEntity} = require('strapi-utils')
module.exports = {
  async create(ctx) {
    const {articleId} = ctx.params

    ctx.request.body.user = ctx.state.user.id;
    ctx.request.body.article = articleId;

    const article = await strapi.services.article.findOne({id: articleId})
    if(!article) {
      return ctx.throw(404)
    }

    const entity = await strapi.services.comment.create(ctx.request.body)
    return sanitizeEntity(entity, {model: strapi.models.comment})
  },
  async find(ctx) {
    const {articleId} = ctx.params
    const entities = await strapi.services.comment.find({article: articleId})
    return entities.map(entity => sanitizeEntity(entity, {model: strapi.models.comment}))
  },
  async update(ctx) {
    const { articleId, id } = ctx.params;
    const comment = await strapi.services.comment.findOne({
      id,
      article: articleId,
    })
    if(!comment) {
      return ctx.throw(404)
    }
    if(ctx.request.body.article || ctx.request.body.user) {
      return ctx.throw(400, 'article or user field cannot be changed')
    }
    if(ctx.state.user.id !== comment.user.id) {
      return ctx.unauthorized(`You can't update this entity`)
    }
    const entity = await strapi.services.comment.update({id}, ctx.request.body)
    return sanitizeEntity(entity, {model: strapi.models.comment})
  },
  async delete(ctx) {
    const { articleId, id } = ctx.params;
    const comment = await strapi.services.comment.findOne({
      id,
      article: articleId,
    })
    if(!comment) {
      return ctx.throw(404)
    }
    if(ctx.state.user.id !== comment.user.id) {
      return ctx.unauthorized(`You can't update this entity`)
    }
    await strapi.services.comment.delete({id})
    ctx.status = 204
  }
};
