<template>
    <v-container>
        <v-row>
            <v-col>
                <v-sheet class="d-flex justify-center w-100 rounded elevation-1" :style="{
                    backgroundImage: 'url(/static/img/idiotikon-search.jpg)',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    height: '360px',
                }">
                    <v-sheet class="px-5 pb-0 pt-5 rounded-sm align-bottom" :style="{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        textAlign: 'center',
                        width: '500px',
                        maxWidth: '90%',
                        marginTop: 'auto',
                        marginBottom: 'auto'
                    }">
                        <div class="text-h3 pb-3" :style="{ color: '#FFFFFF', fontWeight: 500 }">Suche im Wörterbuch
                        </div>
                        <SearchField />
                    </v-sheet>
                </v-sheet>
            </v-col>
        </v-row>

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

        <v-row>
            <v-col cols="12" sm="6" md="8" class="d-flex pb-0">
                <v-card class="focus w-100">
                    <v-card-title class="text-h3">
                        <NuxtLink to="/wortgeschichten" :style="{ textDecoration: 'None' }">Wortgeschichten</NuxtLink>
                    </v-card-title>
                    <v-card-text v-if="wordStories" class="pa-0">
                        <WordStory v-for="ws in wordStories" :wsAttrs="ws" type='teaser' />
                    </v-card-text>
                    <v-btn :to="`/wortgeschichten`">Alle anzeigen</v-btn>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4" class="d-flex pb-0">
                <v-card class="focus w-100">
                    <v-card-title class="text-h3">
                        <NuxtLink to="/mitteilungen" :style="{ textDecoration: 'None' }">Mitteilungen</NuxtLink>
                    </v-card-title>
                    <v-card-text v-if="announcements" class="pa-0">
                        <Announcement v-for="ann in announcements" :title="ann.title" :date="ann.date"
                            :mdContent="ann.content" :slug="ann.slug" :picture="ann.picture" :teaserOnly="true" />
                    </v-card-text>
                    <v-btn :to="`/mitteilungen`">Alle anzeigen</v-btn>
                </v-card>
            </v-col>
        </v-row>

        <v-card class="focus">
            <v-card-title class="text-h3">
                <NuxtLink to="/projekte" :style="{ textDecoration: 'None' }">Projekte</NuxtLink>
            </v-card-title>
            <v-card-text class="pa-0">
                <ProjectOverview :limit="projectLimit" />
                <v-btn :to="`/projekte`">Alle anzeigen</v-btn>
            </v-card-text>
        </v-card>


        <v-card class="rounded" :style="{
            backgroundImage: 'url(static/img/idiotikon_0003a.jpg)',
            backgroundPosition: '100% 0%',
            backgroundSize: 'cover',
            backgroundAttachment: 'scroll',
        }"><v-card class="pa-6 rounded elevation-1"
                :style="{ backgroundColor: 'rgba(102, 0, 0, 0.7)', color: '#FFFFFF' }">
                <v-card-title class="text-h3 text-wrap px-0 pb-5">Die nationalen Wörterbücher</v-card-title>
                <v-card-text class="px-0">
                    <v-row class="ma-0">
                        <v-col cols="12" md="7" lg="8" class="pa-0">
                            <p>Die vier Nationalen Wörterbücher dokumentieren und erklären die dialektalen und
                                historischen
                                Wortschätze der vier Landessprachen der Schweiz. Diese Werke befinden sich in
                                unterschiedlichen
                                Stadien
                                ihrer Erarbeitung; das älteste ist das Schweizerische Idiotikon.</p>

                            <p>Die Wörterbücher werden finanziert von den Schweizer Kantonen und der <em>Schweizerischen
                                    Akademie
                                    der
                                    Geistes- und Sozialwissenschaften (SAGW).</em></p>
                        </v-col>
                        <v-col cols="12" md="5" lg="4" class="py-0 pb-3">
                            <v-list density="compact" :style="{ backgroundColor: 'rgba(0,0,0,0)', color: '#FFFFFF' }"
                                class="pa-0">
                                <v-list-item :prepend-icon="mdiBookOpenVariant" class="pl-0">
                                    <NuxtLink class="nwb_link" to="https://www.drg.ch" target="_blank">Dicziunari
                                        Rumantsch Grischun
                                        (DRG)
                                    </NuxtLink>
                                </v-list-item>
                                <v-list-item :prepend-icon="mdiBookOpenVariant" class="pl-0">
                                    <NuxtLink class="nwb_link" to="https://www.unine.ch/gpsr" target="_blank">
                                        Glossaire des patois de la Suisse romande (GPSR)</NuxtLink>
                                </v-list-item>
                                <v-list-item :prepend-icon="mdiBookOpenVariant" class="pl-0">
                                    <NuxtLink class="nwb_link" to="https://www4.ti.ch/?id=25042" target="_blank">
                                        Vocabolario dei
                                        dialetti
                                        della Svizzera italiana (VSI)</NuxtLink>
                                </v-list-item>
                            </v-list>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-card>
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
