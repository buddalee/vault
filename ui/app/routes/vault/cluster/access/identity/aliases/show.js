import AdapterError from '@ember-data/adapter/error';
import { hash } from 'rsvp';
import { set } from '@ember/object';
import Route from '@ember/routing/route';
import { TABS } from 'vault/helpers/tabs-for-identity-show';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),

  model(params) {
    let { section } = params;
    let itemType = this.modelFor('vault.cluster.access.identity') + '-alias';
    let tabs = TABS[itemType];
    let modelType = `identity/${itemType}`;
    if (!tabs.includes(section)) {
      const error = new AdapterError();
      set(error, 'httpStatus', 404);
      throw error;
    }
    // TODO peekRecord here to see if we have the record already
    return hash({
      model: this.store.findRecord(modelType, params.item_alias_id),
      section,
    });
  },

  setupController(controller, resolvedModel) {
    let { model, section } = resolvedModel;
    controller.setProperties({
      model,
      section,
    });
  },
});
