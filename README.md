template
========

name to come

## todo

* tests
* documentation

## doc

### attributes

* `data-if` : interprets the element if the tested value isn't empty or falsy, otherwise removes it
* `data-unless` : interprets the element if the tested value is empty or falsy, otherwise removes it
* `data-each` : interprets and repeats the element for each item in an object
* `data-value` : sets the `innerHTML` property of with the given value
* `data-textnode` : converts the element into a _textNode_, escapes HTML tags by default. 
* `data-strip` : Strips the value's HTML tags. 
* `data-escape` : Escapes the value's HTML tags. 

## draft

### template

```html
<!DOCTYPE html>
<title></title>
<section id="template" hidden>
  <ul>
    <li data-each="values" data-attrs="class" class="element-#{id}">
      <span data-value="value" data-textnode></span>
      <ul data-if="sub">
        <li data-each="sub" data-value></li>
      </ul>
    </li>
    <li data-unless="desc">No value</li>
    <li data-if="desc2">
      Values :
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
</section>
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
 