<template>
    <v-container class="text-center">
        <v-row>
            <v-col>
                <h1>Welcome to the Playground App</h1>
                <p>
                    This application is designed to showcase and test various components from the UI module.
                </p>
                <p>
                    Use this environment to explore, debug, and refine components before integrating them into a main
                    application.
                </p>
            </v-col>
        </v-row>
    </v-container>

    <idiCmsAccordion :content="[
        {
            title: 'Panel 1',
            text: 'This is **markdown** content for panel 1.',
            pictures: [{ picture: { url: '/uploads/img1.jpg' } }],
            // open: true,
            icon: 'mdi-book-open',
            subtitle: 'Optional subtitle',
            customClass: 'my-panel-class'
        },
        {
            title: 'Panel 2',
            text: 'Panel 2 content goes here.',
            pictures: [],
            open: false
        }
    ]" width="80%" backgroundImage="/images/bg.jpg" aria-label="My Custom Accordion"
        @open="idx => console.log('Panel opened:', idx)" @close="idx => console.log('Panel closed:', idx)">
        <!-- Optional: Custom slot for a specific panel -->
        <template #panel-1="{ item }">
            <div>
                <h3>Custom Content for Panel 2</h3>
                <p>{{ item.text }}</p>
                <!-- You can add more custom markup here -->
            </div>
        </template>
    </idiCmsAccordion>

</template>

<script setup lang="ts">
</script>

<style scoped>
h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

p {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}
</style>
