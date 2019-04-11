<template>
  <Footer>
    <div class="copyright">
      {{ $t("webconfig.copyright") }}
    </div>
  </Footer>
</template>

<style lang="<%= options.cssPreprocessor %>">
.copyright {
  text-align: center;
  color: $color;
}
</style>
