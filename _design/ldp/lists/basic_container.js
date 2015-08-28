function(head, req) {
  var headers = {
    'Accept-Post': 'text/turtle, application/ld+json',
    'Link': '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"'
          + ",\n "
          + '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
  };

  var ids = [];
  while (row = getRow()) {
    ids.push(row.id);
  }

  // used for both JSON and JSON-LD
  function theJSONs() {
    start({headers: headers});
    return toJSON({
      "@context": "http://www.w3.org/ns/anno.jsonld",
      "@id": "http://example.org/annotations/",
      "@type": "BasicContainer",
      "label": "A Container for Open Annotations",
      "contains": ids
    });
  };

  // JSON
  provides('json', theJSONs);

  // JSON-LD
  registerType('json-ld', 'application/ld+json');
  provides('json-ld', theJSONs);

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
