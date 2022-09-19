import { AzureApplicationInsights } from '../AzureApplicationInsights';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup, LogAnalyticsWorkspace, AzurermProvider} from "@cdktf/provider-azurerm";

const app = new App();
const stack = new TerraformStack(app, "testAzureApplicationInsights");
    
new AzurermProvider(stack, "azureFeature", {
    features: {},
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

new AzureApplicationInsights(stack, 'testappi', {
  name: 'la-test',
  location: 'eastus',
  resource_group_name: rg.name ,
  application_type: "web",
  workspace_id: la.id,
});
    
app.synth();