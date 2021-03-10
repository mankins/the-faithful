<script>
  import { prettyPrintJson } from 'pretty-print-json';
  import '$styles/pretty-print-json.css';
  export let obj = {};
</script>

{@html prettyPrintJson.toHtml(obj)}
