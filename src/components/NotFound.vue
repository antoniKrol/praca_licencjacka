<template>
    <VContainer class="fill-height" fluid>
        <VRow align="center" justify="center">
            <VCol cols="12" sm="8" md="6">
                <VCard class="elevation-12" color="secondary">
                    <VCardText class="display-1 font-weight-bold">
                        <VIcon large>mdi-alert-circle</VIcon> 404
                    </VCardText>
                    <VCardText class="headline font-weight-bold">
                        Nie znaleziono strony
                    </VCardText>
                    <VCardText>
                        Przepraszamy, strona której szukasz nie istnieje
                    </VCardText>
                    <VCardActions>
                        <v-spacer></v-spacer>
                        <VBtn icon="mdi-home" color="on-secondary" to="/" />
                    </VCardActions>
                </VCard>
            </VCol>
        </VRow>
    </VContainer>
</template>
  
<script>
export default {
    name: 'NotFound',
};
</script>