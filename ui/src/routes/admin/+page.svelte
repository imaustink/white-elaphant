<script type="ts">
  import { onMount } from 'svelte';
  import { fetchParticipants } from "$lib";
  import "@picocss/pico";

  let loading = false;
  let participants;
  let uiError;
  
  onMount(() => {
    loading = true;
    fetchParticipants()
      .then((result) => {
        participants = result;
        uiError = null;
      })
      .catch((error) => {
        uiError = error;
      })
      .finally(() => {
        loading = false
      });
  });

</script>

<style>

</style>

<main class="container">
  <h1>Participants</h1>
  {#if loading}
    <p>Loading...</p>
  {:else}
    {#if participants?.length}
      <ol>
        {#each participants as { name }}
          <li>{name}</li>
        {/each}
      </ol>
    {:else}
      <p>No participants.</p>
    {/if}
  {/if}
  {#if uiError} 
    <p class="error">{uiError.message}</p>
  {/if}
</main>