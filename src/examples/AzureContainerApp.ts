import { AzureContainerApp } from '../AzureContainerApp';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup, LogAnalyticsWorkspace, AzurermProvider} from "@cdktf/provider-azurerm";
import {AzapiProvider} from "../../.gen/providers/azapi"

const app = new App();
const stack = new TerraformStack(app, "testAzureContainerApp");
    
new AzurermProvider(stack, "azureFeature", {
    features: {},
  });

new AzapiProvider(stack, "azureAzapi", {
});

const rg = new ResourceGroup(stack, "rg", {
  location: 'eastus',
  name: 'rg-latest',

});

const la = new LogAnalyticsWorkspace(stack, "log_analytics", {
  location: 'eastus',
  name: 'appinsight-test',
  resourceGroupName: rg.name,
});

new AzureContainerApp(stack, 'container_app', {
  name: 'acatest888',
        location: 'eastus',
        resource_group_id: rg.id,
        container_name: "tetris",
        container_port: 8080,
        cpu_requests: 0.5,
        image: "uzyexe/tetris",
        ingress_enabled: true,
        max_replicas: 3,
        mem_requests: "1Gi",
        min_replicas: 1,
        container_tag: "latest",
        loganalytics_id: la.workspaceId,
        loganalytics_primary_key: la.primarySharedKey,
        acr_url: "testacr.azurecr.io"
});
    
app.synth();