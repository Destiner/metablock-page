<template>
  <div class="page">
    <div class="content">
      <div>metablock.</div>
      <div>the chain explorer for chain explorers</div>
      <div class="cta">
        <i>soon</i>
        <!-- Tssss, it's too early anon -->
        <!-- <a
          href="https://tally.so/r/wgydMm"
          target="_blank"
        >
          join waitlist
        </a> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap');

.page {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background: #fafafa;
  color: #333;
  font-family: 'Courier Prime', Consolas, Monaco, 'Andale Mono', monospace;
  font-size: 18px;
  line-height: 1.6;
}

.content {
  max-width: 800px;
  margin-top: 24vh;
}

@media (min-width: 768px) {
  .content {
    min-width: 600px;
  }
}

a {
  color: #333;
}

.cta {
  margin-top: 32px;
}

/* Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  height: 100%;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}
</style>
