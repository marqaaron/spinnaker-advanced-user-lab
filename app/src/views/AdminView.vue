<template>
    <div :class="containerClasses" v-if="!isLoadingContent">
        <releases v-if="activeContent === 'releases'" @contentLoaded="onContentLoaded($event)"></releases>
    </div>
    <div v-else>
        <loading-screen></loading-screen>
    </div>
</template>

<script>
import LoadingScreen from "@/core/layout/components/LoadingScreen";
import {mapGetters} from "vuex";
import helpers from "@/core/utilities/helpers";
import Releases from "@/modules/releases/Releases";
export default {
    name: "AdminView",
    data() {
        return {
            activeMenu: 'admin',
            defaultContent: 'releases',
            availableContent: [
                'releases'
            ],
            subContentLoading: false
        }
    },
    created() {
        this.setActiveContent();
    },
    computed: {
        ...mapGetters([
            'isLoadingContent',
            'activeContent'
        ]),
        containerClasses(){
            return {
                "padded-container": !this.subContentLoading
            }
        }
    },
    methods: {
        setActiveContent(){
            let activeContent;
            if(typeof this.$route.params.activeContent !== 'undefined'){
                activeContent = this.$route.params.activeContent;
                this.$store.dispatch('setActiveMenu',this.activeMenu);
                this.$store.dispatch('setActiveContent',activeContent);
                if(!helpers.validContent(this.availableContent,activeContent)){
                    this.$router.replace('/' + this.activeMenu + '/' + this.defaultContent);
                }
                if(helpers.queryPresent(this.$route.query)){
                    console.log('Query Parameters Present but not handled.')
                }
            } else {
                this.$router.replace('/' + this.activeMenu + '/' + this.defaultContent);
            }
        },
        onContentLoaded(event){
            this.subContentLoading = !event;
        }
    },
    components: {
        'loading-screen': LoadingScreen,
        'releases': Releases
    },
    watch: {
        $route(){
            this.setActiveContent();
        }
    }
}
</script>

<style scoped>

</style>
