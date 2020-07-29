<template>
  <div></div>
</template>

<script>

  export default {
    name: "SignIn",
    mounted() {
      window.location.href = "https://isdemo.efive.ru/connect/authorize" +
        "?client_id=SAM5DE_WEB_REMOTE" +
        "&scope=openid profile" +
        "&algorithm=RS256" +
        "&leeway=100" +
        "&grant_type=implicit" +
        "&response_type=id_token" +
        "&nonce=CqsU9wZlQIYGUB86" +
        "&redirect_uri=http://opencode.su:9032/";
    }
  }

</script>
