<script>
  const Posts = require("./Posts.svelte");
  const Following = require("./Following.svelte");
  let profile = false;

  let description = false;
  let following = false;
  let blocking = false;
  let image;
  export let feed = ssb.feed;
  let lastAbout;
  let avatarPromise;
  let aboutPromise;
  let subViews = {
    posts: Posts,
    following: Following
  };
  let currentSubView = "posts";

  let name = feed;

  document.title = `Patchfox - Feed: ${feed}`;

  console.log("fetching", feed);

  avatarPromise = ssb.avatar(feed).then(data => {
    name = data.name;
    image = data.image;
    document.title = `Patchfox - Feed: ${name}`;
  });

  aboutPromise = ssb.profile(feed).then(data => {
    lastAbout = data.about.reverse().find(m => {
      let a = m.value.content;
      return a.hasOwnProperty("description");
    });
    try {
      description = lastAbout.value.content.description;
    } catch (n) {
      description = "";
    }
    window.scrollTo(0, 0);
  });

  if (feed !== ssb.feed) {
    ssb.following(feed).then(f => (following = f));
    ssb.blocking(feed).then(f => (blocking = f));
  }

  const blockingChanged = ev => {
    let v = ev.target.checked;
    if (v) {
      ssb.block(feed).catch(() => (blocking = false));
    } else {
      ssb.unblock(feed).catch(() => (blocking = true));
    }
  };

  const followingChanged = ev => {
    let v = ev.target.checked;
    if (v) {
      ssb.follow(feed).catch(() => (following = false));
    } else {
      ssb.unfollow(feed).catch(() => (following = true));
    }
  };
</script>

<style>

</style>

<div class="container">
  {#await aboutPromise && avatarPromise}
    <div class="loading loading-lg" />
  {:then}
    <div class="columns">

      <div class="column col-6">
        <div class="container">
          <img
            class="img-responsive"
            src="http://localhost:8989/blobs/get/{image}"
            alt={feed} />
        </div>
      </div>
      <div class="column col-6">
        {#if feed === ssb.feed}
          <span class="chip">❤ Thats You ❤</span>
        {/if}
        <h1>{name}</h1>
        <span class="chip">{feed}</span>
        {#if feed !== ssb.feed}
          <div class="container">
            <div class="divider" />
            <div class="form-group">
              <label class="form-switch form-inline">
                <input
                  type="checkbox"
                  on:change={followingChanged}
                  bind:checked={following} />
                <i class="form-icon" />
                following
              </label>
              <label class="form-switch form-inline">
                <input
                  type="checkbox"
                  on:change={blockingChanged}
                  bind:checked={blocking} />
                <i class="form-icon" />
                blocking
              </label>
            </div>
            <div class="divider" />
          </div>
        {/if}
        {#await aboutPromise}
        <div class="loading"></div>
        {:then}
        <p>
          {@html ssb.markdown(description)}
        </p>
        {/await}
      </div>
    </div>
    <br>
    <ul class="tab tab-block">
      <li class="tab-item" class:active={currentSubView === 'posts'}>
        <a href="#"
          on:click|preventDefault={() => (currentSubView = 'posts')}>
          Posts
        </a>
      </li>
      <li class="tab-item" class:active={currentSubView === 'friends'}>
        <a href="#"
          on:click|preventDefault={() => (currentSubView = 'friends')}>
          Friends
        </a>
      </li>
      <li class="tab-item" class:active={currentSubView === 'following'}>
        <a href="#"
          on:click|preventDefault={() => (currentSubView = 'following')}>
          Following
        </a>
      </li>
      <li class="tab-item" class:active={currentSubView === 'followers'}>
        <a href="#"
          on:click|preventDefault={() => (currentSubView = 'followers')}>
          Followers
        </a>
      </li>
    </ul>
    <br>
    <svelte:component this={subViews[currentSubView]} {feed} />
  {:catch n}
    <p>Error: {n.message}</p>
  {/await}
</div>