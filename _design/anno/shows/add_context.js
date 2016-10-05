function(doc, req) {


  // JSON-LD
  var rv = doc;
  rv['@context'] = "http://www.w3.org/ns/anno.jsonld";
  // remove CouchDB _revisions cruft (since this isn't the CouchDB API)
  delete rv['_revisions'];
  return {
    headers: {
      'Allow': 'GET, HEAD, OPTIONS, PUT, DELETE',
      'Content-Type': 'application/ld+json;profile="http://www.w3.org/ns/anno.jsonld"',
      'Link': '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
    },
    body: JSON.stringify(rv, null, 2)
  };
}
