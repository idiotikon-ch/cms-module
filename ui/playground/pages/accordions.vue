<template>
    <div>
        <idiCmsAccordion :content="[
            {
                title: 'Panel 1',
                text: 'This is **markdown** content for panel 1.',
                pictures: [{ picture: { url: '/uploads/img1.jpg' } }],
                // open: true,
                icon: 'mdi-book-open',
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
    </div>
</template>

<script setup>
</script>