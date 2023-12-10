<script type="ts">
  import { onMount, onDestroy } from 'svelte';
  import { env } from '$env/dynamic/public';
  import Snowflakes from 'magic-snowflakes';
  import { registerParticipant } from "$lib";
  import "@picocss/pico";

  let snowflakes;

  onMount(() => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    snowflakes = new Snowflakes({
      color: isDarkMode ? "#fff" : "#9c9c9c"
    });
    snowflakes.start();
  });

  onDestroy(() => {
    snowflakes?.destroy();
  });

  let uiError = null;
  let uiSuccess = null;
  let uiSuccessTimer = null;
  $: name = "";
  $: loading = false;
  $: disableForm = loading || name.length < 2;

  const { PUBLIC_PAGE_TITLE = "White Elephant Gift Exchange" } = env;

  const showSuccessMessage = (message) => {
    uiSuccess = message;
    if (uiSuccessTimer) {
      clearTimeout(uiSuccessTimer);
    }
    uiSuccessTimer = setTimeout(() => {
      uiSuccess = false;
    }, 3000);
  }

  const handleSubmit = (event) => {
    loading = true;
    event.preventDefault();
    registerParticipant(name)
      .then((result) => {
        console.log(result);
        name = "";
        uiError = null;
        showSuccessMessage(`Saved! (${result.uuid.slice(0, 3)})`);
      })
      .catch((error) => {
        uiError = error;
      })
      .finally(() => {
        loading = false;
      });
  };

</script>

<style>

</style>

<main class="container">
  <h1>{PUBLIC_PAGE_TITLE}</h1>
  <form on:submit={handleSubmit}>
    <input
      name="name"
      aria-busy={loading ? "true" : undefined}
      bind:value={name}
      placeholder="Enter your name..."
    >
    <button type="submit" disabled='{disableForm}'>{#if loading}Loading...{:else}Register{/if}</button>
    {#if uiError} 
      <p class="error">{uiError.message}</p>
    {/if}
  </form>
  <div id="snackbar" class={uiSuccess ? "show" : undefined}>{uiSuccess}</div>
</main>