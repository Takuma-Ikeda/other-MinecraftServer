import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

interface IRecipesVpcMultiAzProps {
    context: cdk.Stack;
}

const RecipesVpcMultiAz = (props: IRecipesVpcMultiAzProps) => {
    const vpc = new ec2.Vpc(props.context, 'vpc', {
        cidr: '10.0.0.0/16',
        natGateways: 0
    })

    return {
        vpc
    };
};

export default RecipesVpcMultiAz;
