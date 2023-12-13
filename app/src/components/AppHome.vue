<template>
  <div class="flex h-screen bg-[#222]">

    <div class="flex w-100">
      <div class="flex-1 flex flex-col">
        <div class="p-2 text-end text-xs bg-[#222] select-none">
          <span><a class="underline" href="https://github.com/PabloFaccianoGlobant/salesforce-certifications" target="_blank">Github</a></span>
          <span class="mx-2">|</span>
          <span>Last update: 12-2023</span>
          <span class="mx-2">|</span>
          <span>Made with &hearts; by <a class="underline" href="https://www.linkedin.com/in/pablofacciano/" target="_blank">Pablo Facciano</a></span>
        </div>

        <v-network-graph class="w-full h-full" :nodes="this.graph.nodes" :edges="this.graph.edges"
          :configs="this.graph.configs" v-model:layouts="this.graph.layouts" @click="this.selectNode(null)">
          <defs>
            <clipPath id="faceCircle" clipPathUnits="objectBoundingBox">
              <circle cx="0.5" cy="0.5" r="2" />
            </clipPath>
          </defs>
          <template #override-node="{ nodeId, scale, config, ...slotProps }">
            <circle class="face-circle" :r="config.radius * scale" fill="#ffffff00" v-bind="slotProps" />
            <image class="face-picture cursor-pointer" :class="{ grayscale: this.graph.nodes[nodeId].grayscale }" :x="-config.radius * scale" :y="-config.radius * scale"
              :width="config.radius * scale * 2" :height="config.radius * scale * 2"
              :xlink:href="`${this.graph.nodes[nodeId].image}`" clip-path="url(#faceCircle)"
              @click="this.selectNode(nodeId)" />
          </template>
        </v-network-graph>

        <div class="p-4 text-xs bg-neutral-900 select-none">
          <span class="me-4">{{ sideList.listName }}</span>
          <span v-for="item in sideList.listItems" :key="item"
            class="cursor-pointer inline-flex me-2 items-center rounded-md px-2 py-1 font-medium ring-1 ring-inset ring-gray-500/10"
            :class="{ 'bg-blue-900 text-white': this.sideList.selectedItem == item, 'text-gray-500': this.sideList.selectedItem != item}"
            @click="changeCategory(item)" >{{ item }}</span>
        </div>
         
      </div>
      <div class="flex-initial bg-[#555] p-6 text-start max-h-full overflow-auto" v-if="this.selectedNode">

        <div class="mt-5 mb-3"><img class="w-24 h-auto" :src="this.selectedNode.image" :alt="this.selectedNode.name"/></div>

        <div class="mt-5 mb-3" v-text="this.selectedNode.type"></div>

        <div class="text-2xl pe-6" v-html="this.selectedNode.name"></div>

        <div class="mt-3">
          <span v-for="tag in this.selectedNodeTags" :key="tag" v-text="tag"
            @click="changeCategory(tag)"
            class="cursor-pointer inline-flex me-2 items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"></span>
        </div>
        <div>
          <div class="mt-6 mb-3 font-bold">Details</div>
          <a class="underline cursor-pointer text-sky-400" :href="this.selectedNode.link" target="_blank">Open in a new tab</a>

        </div>

        <div v-if="this.selectedNode.dependencies?.length > 0 ">
          <div class="mt-6 mb-3 font-bold">{{ this.selectedNode.dependencies.length > 1 ? 'Dependencies' : 'Dependency' }}</div>
          <div class="flex flex-col">
            <div class="flex items-center mb-2 cursor-pointer" v-for="nodeId in this.selectedNode.dependencies" :key="nodeId" @click="this.selectNode(nodeId)">
              <img class="w-12 h-auto me-4" :src="this.graph.nodes[nodeId].image" :alt="this.graph.nodes[nodeId].name"/>
              <span v-text="this.graph.nodes[nodeId].name"></span>
            </div>
          </div>
        </div>
        <div v-if="this.selectedNode.related?.length > 0 ">
          <div class="mt-6 mb-3 font-bold">Recommended</div>
          <div class="flex flex-col">
            <div class="flex items-center mb-2 cursor-pointer" v-for="nodeId in this.selectedNode.related" :key="nodeId" @click="this.selectNode(nodeId)">
              <img class="w-12 h-auto me-4" :src="this.graph.nodes[nodeId].image" :alt="this.graph.nodes[nodeId].name"/>
              <span v-text="this.graph.nodes[nodeId].name"></span>
            </div>
          </div>
        </div>
        <div v-if="this.seletedNodesNextSteps?.length > 0 ">
          <div class="mt-6 mb-3 font-bold">Next Steps</div>
          <div class="flex flex-col">
            <div class="flex items-center mb-2 cursor-pointer" v-for="nodeId in this.seletedNodesNextSteps" :key="nodeId" @click="this.selectNode(nodeId)">
              <img class="w-12 h-auto me-4" :src="this.graph.nodes[nodeId].image" :alt="this.graph.nodes[nodeId].name"/>
              <span v-text="this.graph.nodes[nodeId].name"></span>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import content from '@/certifications'

export default {
  components: {},
  data() {
    return {
      sideList: {
        listName: 'Tags:',
        listItems: [],
        selectedItem: 'Developer'
      },
      graph: {
        edges: content.personal_connections,
        nodes: content.certifications,
        layouts: {
          nodes: Object.keys(content.certifications).reduce((result, certificationId) => {
            result[certificationId] = {
              x: content.certifications[certificationId].location.x * 200,
              y: content.certifications[certificationId].location.y * 200
            };
            return result;
          }, {})
        },
        configs: {
          view: {
            autoPanAndZoomOnLoad: "fit-content",
            fitContentMargin: "8%",
            scalingObjects: true,
            minZoomLevel: .1,
            maxZoomLevel: 10,
            panEnabled: true,
            zoomEnabled: true,
          },

          edge: {
            selectable: false,
            type: 'curve',
            normal: {
              width: edge => (edge.animate ? 2 : 2),
              color: "#888",
              dasharray: edge => (edge.animate ? "16" : "0"),
              animate: edge => !!edge.animate
            },
            marker: {
              target: { type: "arrow" },
            },
          },
          node: {
            draggable: false,
            normal: {
              radius: 48
            },
            selected: {
              radius: 56,
              strokeWidth: 1,
              borderRadius: 6,
            },
            hover: {
              radius: 56
            },
            label: {
              color: "#fff",
              margin: 15,
              text: "name",
            }
          }
        }
      },
      selectedNodeId: null,
      selectedNode: null
    }
  },
  computed: {
    seletedNodesNextSteps(){
      let nexts = [];
      if (this.selectedNode){
        Object.keys(this.graph.nodes).forEach(keyy => {
          const certi = this.graph.nodes[keyy];
          if (certi.dependencies?.includes(this.selectedNodeId) || certi.related?.includes(this.selectedNodeId)){
            nexts.push(keyy)
          }
        })
      }
      return nexts;
    },
    selectedNodeTags() {
      if (this.selectNode) {
        return this.selectedNode.tags.split(',')
      }
      return [];
    }
  },
  methods: {
    selectNode(nodeId) {
      this.selectedNodeId = nodeId;
      this.selectedNode = content.certifications[nodeId];
      this.changeCategory("");
    },
    updateGrayscale(){
      Object.keys(this.graph.nodes).forEach(keyy => {
        const certi = this.graph.nodes[keyy];

        if (this.selectedNode && keyy === this.selectedNodeId) {
          certi.grayscale = false;
          return;
        }

        if (this.sideList.selectedItem) {
          if (certi.tags.includes(this.sideList.selectedItem)) {
            certi.grayscale = false;
            return;
          }
        }
        if (!this.sideList.selectedItem && !this.selectedNode) {
          certi.grayscale = false;
          return;
        }

        certi.grayscale = true;
      });
      
    },
    changeCategory(item){
      if (this.sideList.selectedItem == item){
        this.sideList.selectedItem = null;
      } else {
        this.sideList.selectedItem = item;
      }
      this.updateGrayscale();
    }
  },
  mounted() {
    const tagsSet = new Set();
    Object.keys(content.certifications).forEach(keyy => {
      const objeto = content.certifications[keyy];
      if (objeto.tags) {
        const tagsArray = objeto.tags.split(',');
        tagsArray.forEach(tag => tagsSet.add(tag.trim()));
      }
    });
    this.sideList.listItems = Array.from(tagsSet).sort();
  },
  
}
</script>

<style scoped>
.grayscale {
  filter: grayscale(1);
  opacity: .2;
}
</style>