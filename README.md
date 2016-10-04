# Web Annotation Protocol on CouchDB

[Apache CouchDB](http://couchdb.apache.org/)'s HTTP API is quite
similar to the [Web Annotation Protocol](http://w3.org/TR/annotation-protocol/)
except the later is specific to Annotation.

This project closes the loop by providing a set of CouchApp
functions (`_update`, `_show`, etc) that add the remaining
Web Annotation Protocol specific semantics.

## Usage

0. `npm install && npm install -g gulp`
1. Copy `config.json.sample` to `config.json`
2. Change `config.json` to match your setup.
3. `gulp` (or only `gulp apps` or `gulp docs`)
4. Send Web Annotation Protocol requests to the URL you set in `config.json`
   plus `_design/anno/_rewrite/`
5. (optional) [Setup a Virtual Host](http://docs.couchdb.org/en/1.6.1/config/http.html#vhosts)
to make the URL above prettier.

## Sample Requests

Assuming your setup matches mine :smiley_cat:

* http://localhost:5984/annotations/_design/anno/_rewrite/
  * returns a Turtle representation of the Basic Container (which references
  the documents contained in this container.
* http://localhost:5984/annotations/_design/anno/_rewrite/a
  * returns a JSON-LD representation of the `a` document + the
  [Web Annotation Data Model JSON-LD Context](http://www.w3.org/TR/annotation-model/#json-ld-context).

## License

Apache License 2.0
