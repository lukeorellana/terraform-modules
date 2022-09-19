import { Testing, TerraformStack} from 'cdktf';
import {AzurermProvider} from "@cdktf/provider-azurerm";
import { AzureApplicationInsights } from './AzureApplicationInsights';
import 'cdktf/lib/testing/adapters/jest';


describe('AzureApplicationInsights-Snapshot', () => {
  it('renders a AzureApplicationInsights without tags', () => {

    const synthed = Testing.synthScope((stack) => {
      new AzureApplicationInsights(stack, 'testAppi', {
        name: 'appi-test',
        location: 'eastus',
        resource_group_name: "rg-test",
        application_type: "web",
        daily_data_cap_in_gb: 10,
        daily_data_cap_notification_disabled: true,

      });
    });
  
    expect(synthed).toMatchSnapshot();
  });

  it('renders a AzureApplicationInsights with tags', () => {
    const synthed = Testing.synthScope((stack) => {
      new AzureApplicationInsights(stack, 'testAppi', {
        name: 'appi-test',
        location: 'eastus',
        resource_group_name: "rg-test",
        application_type: "web",
        daily_data_cap_in_gb: 10,
        daily_data_cap_notification_disabled: true,
        tags: {
          environment: "test",
        },

      });
    });
    expect(synthed).toMatchSnapshot();
  });
});


describe("AzureApplicationInsights-Terraform", () => {
  it("check if the produced terraform configuration is valid", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    
    new AzurermProvider(stack, "azureFeature", {
      features: {},
    });


    new AzureApplicationInsights(stack, 'testAppi', {
      name: 'appi-test',
      location: 'eastus',
      resource_group_name: "rg-test",
      application_type: "web",
      daily_data_cap_in_gb: 10,
      daily_data_cap_notification_disabled: true,
      tags: {
        environment: "test",
      },

    });
    

    // We need to do a full synth to validate the terraform configuration
    expect(Testing.fullSynth(stack)).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", {
      features: {},
    });

    new AzureApplicationInsights(stack, 'testAppi', {
      name: 'appi-test',
      location: 'eastus',
      resource_group_name: "rg-test",
      application_type: "web",
      daily_data_cap_in_gb: 10,
      daily_data_cap_notification_disabled: true,
      tags: {
        environment: "test",
      },

    });


    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(stack)).toPlanSuccessfully();
  });
});
