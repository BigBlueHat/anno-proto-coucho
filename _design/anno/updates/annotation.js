function(doc, req) {
  var resp = {
    headers: {
      'Content-Type': 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'
    }
  };

  if (!doc) {
    // new document...
    if ('id' in req && req['id']) {
      // PUT scenario...
      // TODO: do we support PUT for create in Web Annotation Protocol?
      return [{'_id': req['id']}, 'New World']
    }

    // via POST, parse the body, check for things, save it
    // TODO: check inbound Content-Type?
    var new_doc = JSON.parse(req.body);
    if ('id' in new_doc) {
      // we have an `id` set already,
      // move it to `canonical` (if that's not set)
      if (!('canonical' in new_doc)) {
        new_doc.canonical = new_doc.id;
      } else {
        // `canonical` was already set, so toss the old `id` into `via`
        if ('via' in new_doc) {
          if (typeof(new_doc.via) === 'string') {
            new_doc.via = [new_doc.via, new_doc.id];
          } else {
            new_doc.via.push(new_doc.id);
          }
        }
      }
      // now that we've preserved the old `id`, let's set our own
    }
    // TODO: properly set this as an IRI (not just a relative string)?
    new_doc.id = new_doc._id = req.uuid;

    // set required Annotation fields
    new_doc['@context'] = "http://www.w3.org/ns/anno.jsonld";
    // TODO: preserve any additional types? Validate that this is set inbound (instead)?
    new_doc['type'] = 'Annotation';
    resp.body = toJSON(new_doc);
    resp.headers['Location'] = new_doc.id;
    return [new_doc, resp];
  }

  // an update request

  // save the doc, return the doc
  resp.body = toJSON(doc);

  return [doc, resp];
}
