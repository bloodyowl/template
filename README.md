template
========

name to come

## todo

* tests
* documentation


## draft

### template

```html
<tmpl id="template">
  <ul>
    <li data-each="values" class="element-#{id}">
      <txt data-value="value"></txt>
      <ul data-if="sub">
        <li data-each="sub" data-value></li>
      </ul>
    </li>
    <li data-unless="desc">No value</li>
    <li data-if="desc2">
      <txt data-content="Values :"></txt>
      <ul>
        <li data-each="desc2" data-value></li>
      </ul>
    </li>
    <li data-with="foo">
      <strong data-value="bar" data-escape></strong>
    </li>
    <li>
      <strong data-value="foo.bar" data-strip></strong>
    </li>
  </ul>
</tmpl>
```

### data

```json
{
  "values": [
    {
      "id": 3,
      "value": "foo"
    },
    {
      "id": 6,
      "value": "bar",
      "sub": [
        "sub 1",
        "sub 2",
        "sub 3"
      ]
    },
    {
      "id": 7,
      "value": "baz"
    }
  ],
  "desc": [],
  "desc2": [
    "hello"
  ],
  "foo": {
    "bar": "<p>baz</p>"
  }
}
```

### js

```js
evaluate(doocument.getElementById("template").children[0], data)
```

### rendering

```html
<ul>
  <li class="element-3">foo</li>
  <li class="element-6">bar
    <ul>
      <li>sub 1</li>
      <li>sub 2</li>
      <li>sub 3</li>
    </ul>
  </li>
  <li class="element-7">baz</li>
  <li>No value</li>
  <li>Values :
    <ul>
      <li>hello</li>
    </ul>
  </li>
  <li>
    <p><strong>&lt;p&gt;baz&lt;/p&gt;</strong></p>
  </li>
  <li>
    <p><strong>baz</strong></p>
  </li>
</ul>
```
 