<script>
  import { prettyPrintJson } from 'pretty-print-json';
  import stringify from 'json-stable-stringify';

  import '$lib/styles/pretty-print-json.css';
  export let obj = {};
  // JSON.stringify(sortMyObj, Object.keys(sortMyObj).sort()); => keep in
</script>
{@html prettyPrintJson.toHtml(
  JSON.parse(stringify(obj))
)}
