function(head, req) {
  var headers = {
    'Accept-Post': 'text/turtle, application/ld+json',
    'Link': '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"'
          + ",\n "
          + '<http://www.w3.org/TR/annotation-protocol/constraints>; rel="http://www.w3.org/ns/ldp#constrainedBy"',
    'Vary': 'Accept',
    'Allow': 'GET, HEAD, OPTIONS, POST',
    // TODO: make this actually correct...
    'Content-Location': "http://example.org/annotations/"
  };

  var ids = [];
  while (row = getRow()) {
    ids.push(row.id);
  }

  // used for both JSON and JSON-LD
  function theJSONs(media_type) {
    headers['Content-Type'] = media_type || 'application/json';
    start({headers: headers});
    return toJSON({
      "@context": [
        "http://www.w3.org/ns/anno.jsonld",
        "http://www.w3.org/ns/ldp.jsonld"
      ],
      "id": "http://example.org/annotations/",
      "type": ["BasicContainer", "AnnotationCollection"],
      "label": "A Container for Web Annotations",
      "first": {
        "type": "AnnotationPage",
        "items": ids
      }
    });
  };

  // JSON-LD
  registerType('json-ld', 'application/ld+json');
  provides('json-ld', theJSONs.bind(this,
    'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'));

  // JSON
  provides('json', theJSONs);

  // Turtle
  registerType('turtle', 'text/turtle');
  provides('turtle', function() {
    start({headers: headers});

    send('@prefix ldp: <http://www.w3.org/ns/ldp#>.' + "\n\n");

    send('</' + req.info.db_name + '/> a ldp:BasicContainer;' + "\n");
    send('  ldp:contains');
    // output the ID's contained in this container
    send(' <' + ids.join('>, <') + '>.');
  });
}
