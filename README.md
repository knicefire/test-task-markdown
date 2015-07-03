# Simple Markdown to HTML Hapi module

### Overview
The module is a **Hapi** module that accepts text in markdown format and stores it in **MongoDB** storage

### Supported syntax construction

<pre>
###      - Header declaration
**...**  - Strong declaration
*...*    - Emphasis declaration
[Link]   - (http://example.com) Link declaration
</pre>

### Known issues
Triple star syntax \*\*\*...\*\*\* - Is not supported

Examples:

<pre>
**Hello *everyone***
***Hello everyone***
</pre>

Solution is to explicitly define tags

<pre>
**Hello *everyone* **
** *Hello everyone* **
* **Hello everyone** *
</pre>

### Warning
**It has been written to accomplish test task**

*It does not cover the whole markdown specification, so use it on your own risk*

For fully functional markdown parser visit [**marked**](https://github.com/chjj/marked) project at github
