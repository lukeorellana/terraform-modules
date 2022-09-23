import { Testing, TerraformStack} from 'cdktf';
import { exampleAzureContainerApp} from './examples/ExampleAzureContainerApp'
import 'cdktf/lib/testing/adapters/jest';


describe('AzureContainerApp-Snapshot', () => {
  it('renders a AzureContainerApp and checks snapshot', () => {

    const synthed = Testing.synthScope((stack) => {
      new exampleAzureContainerApp(stack, "testAzureContainerApp");
    });
  
    expect(synthed).toMatchSnapshot();
  });
});


describe("AzureContainerApps-Terraform", () => {
  it("check if the produced terraform configuration is valid", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    
    Testing.synthScope((stack) => {
      new exampleAzureContainerApp(stack, "testAzureContainerApp");
    });
  
    // We need to do a full synth to validate the terraform configuration
    expect(Testing.fullSynth(stack)).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");

    Testing.synthScope((stack) => {
      new exampleAzureContainerApp(stack, "testAzureContainerApp");
    });
  

    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(stack)).toPlanSuccessfully();
  });
});
