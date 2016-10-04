function(head, req) {
  // TODO: redirect _rewrite to _rewrite/ (...srsly...)
  // TODO: make page_size configurable...someplace
  var page_size = 10;
  var req_path = req.requested_path;
  // strip out query params from last bit of requested_path
  var last_bit = req_path[req_path.length-1].split('?');
  req_path[req_path.length-1] = last_bit[0];
  var req_query = last_bit[1];
  var container_path = '/' + req_path.join('/');
  var headers = {
    'Accept-Post': 'text/turtle, application/ld+json',
    'Link': '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"'
          + ",\n "
          + '<http://www.w3.org/TR/annotation-protocol/constraints>; rel="http://www.w3.org/ns/ldp#constrainedBy"',
    'Vary': 'Accept',
    'Allow': 'GET, HEAD, OPTIONS, POST',
    'Content-Location': container_path
  };

  var ids = [];
  while (row = getRow()) {
    ids.push(row.id);
  }

  // used for both JSON and JSON-LD
  function theJSONs(media_type) {
    headers['Content-Type'] = media_type || 'application/json';
    var rv = {}; // TODO: set this to an error a container with links?
    if (!('limit' in req.query) && !('show' in req.query)) {
      // we're not paginating atm, so return the container document
      rv = toJSON({
        "@context": [
          "http://www.w3.org/ns/anno.jsonld",
          "http://www.w3.org/ns/ldp.jsonld"
        ],
        "id": container_path,
        "type": ["BasicContainer", "AnnotationCollection"],
        "label": "A Container for Web Annotations",
        "total": head.total_rows,
        "first": {
          "id": container_path + '?limit=' + page_size,
          "type": "AnnotationPage",
          "items": ids.slice(0, page_size)
        },
        "last": container_path + "?limit=" + page_size + "&skip="
          + (Math.round(ids.length / page_size) * page_size)
      });
    } else {
      var skip = Number(req.query.skip || 0);
      // we've got a pagination request, so return an AnnotationPage
      var page = {
        "@context": "http://www.w3.org/ns/anno.jsonld",
        "id": container_path + '?' + req_query,
        "type": "AnnotationPage",
        "partOf": {
          "id": container_path,
          "total": head.total_rows,
        },
        "items": ids
      };
      if ((skip + page_size) < head.total_rows) {
        page.next = container_path
          + "?limit=" + page_size + "&skip=" + (skip + page_size);
      }
      if (skip >= page_size) {
        page.prev = container_path
          + "?limit=" + page_size + "&skip="
          + ((Math.round(head.total_rows/10)*10) - page_size);
      }

      headers['Content-Location'] = page.id;
      rv = toJSON(page);
    }

    start({headers: headers});
    return rv;
  }

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
