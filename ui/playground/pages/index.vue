<template>
    <v-container>
        <v-row v-if="firstTile && infoTile && projectTile">
            <v-col cols="12" sm="6" md="4" class="flex d-flex">
                <CurtainTile :tile="firstTile"></CurtainTile>
            </v-col>
            <v-col cols="12" sm="6" md="4" class="flex d-flex">
                <CurtainTile :tile="infoTile"></CurtainTile>
            </v-col>
            <v-col cols="12" sm="6" md="4" class="flex d-flex">
                <CurtainTile :tile="projectTile"></CurtainTile>
            </v-col>
        </v-row>


        <IdiCmsTileRow></IdiCmsTileRow>


    </v-container>
</template>

<script lang="ts" setup></script>

<style scoped>
.nwb_link {
    color: #FFFFFF;
    font-size: 1.1rem;
    font-weight: bold;
    font-style: italic;
    text-decoration: none;
}
</style>
