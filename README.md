# element-web-ilag-module
A simple Improved Landing As Guest (ILAG) module to demonstrate some functionality of Element Web's Module API.

To install, visit https://github.com/vector-im/element-web/blob/develop/docs/modules.md and install the module
according to the examples.

As part of your `config.json` for element-web, add the following section:

```json
{
  "io.element.module.ilag": {
    "localpartTemplate": "{firstName}{lastName}",
    "passwordTemplate": "{randomString}"
  }
}
```

For both templates, the following variables are supported:

* `{{randomString}}` - A random string of arbitrary length and complexity, lowercase.
* `{{firstName}}` - The first name the user supplied, lowercase.
* `{{lastName}}` - The last name the user supplied, lowercase.

For localparts, non-alphanumeric characters will be removed.

The templates shown above are treated as the defaults, if not provided.

To trigger the module once installed, visit a room where you have peek access and while not logged in. The app
should prompt you to try and "join" the chat - click that and follow the prompts.
