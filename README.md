# athena-struct-parser

A small utility to parse out structs returned by [AWS Athena](https://aws.amazon.com/athena/). Tools such as [`athena-express`](https://github.com/ghdna/athena-express) do a great job at querying Athena, however there's no easy way to get freeform JSON out of it. This tool allows one to parse the Athena's structs & Arrays into JS objects.

## Problem

Let's take the following code as an example:
```js
const results = await athenaExpress.query('SELECT struct, foo, bar FROM my_table');

// `results` is:
// {
//   "Items": [
//     {
//       "struct": "{foo=bar, baz=[{foe=moe}]}",
//       "foo": "baz",
//       "bar": zab
//     }
//   ]
// }
```

It's not easy to get the data out of that `struct` column, even if that's pretty common way to store data (as JSON blobs). One could try to use a rudimentary parser, but it might trip up on un-escaped characters.

## Usage

Install the library via:
```sh
npm i athena-struct-parser
```

```js
import parseStruct from 'athena-struct-parser';

const results = await athenaExpress.query('SELECT struct, foo, bar FROM my_table');

results.Items.map(result => {
  result.struct = parseStruct(result.struct);
  return result;
});

// `results.struct` now contains JS object with data from the struct:
// {
//   "Items": [
//     {
//       "struct": {
//         "foo": "bar",
//         "baz": [
//           {
//             "foe": "moe"
//           }
//         ]
//       }",
//       "foo": "baz",
//       "bar": zab
//     }
//   ]
// }
```
