module.exports = {
  renderFact(fact) {
    return {id: fact.id, description: fact.description, hero: fact.hero, user_id: fact.user_id, created_at: fact.created_at};
  },

  renderFacts(facts) {
    return facts.map(function(fact) {
      return {id: fact.id, description: fact.description, hero: fact.hero, user_id: fact.user_id, created_at: fact.created_at};
    });
  }
}
