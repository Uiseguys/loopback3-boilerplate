'use strict';

module.exports = Attachment => {
  Attachment.observe('after save', function(ctx, next) {
    if (ctx.instance) {
      console.log('Saved %s#%s', ctx.Model.modelName, ctx.instance.id);
    } else {
      console.log(
        'Updated %s matching %j',
        ctx.Model.pluralModelName,
        ctx.where
      );
    }
    next();
  });
};
