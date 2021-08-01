import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecr from '@aws-cdk/aws-ecr';

interface IRecipesEcsFargateProps {
    context: cdk.Stack;
    vpc: ec2.IVpc;
}

const RecipesEcsFargate = (props: IRecipesEcsFargateProps) => {
    const cluster = new ecs.Cluster(props.context, 'EcsFargateCluster', {
        // クラスター名
        clusterName: 'minecraft-ecs-cluster',
        vpc: props.vpc
    });

    const taskDefinition = new ecs.FargateTaskDefinition(props.context, 'EcsFargateTaskDefinition', {
        // CPU・メモリの設定
        cpu: 512,
        memoryLimitMiB: 4096
    });

    const repository = ecr.Repository.fromRepositoryName(props.context, 'Ecr', 'minecraft');

    const containerDefinition = new ecs.ContainerDefinition(props.context, 'MineCraft', {
        image: ecs.ContainerImage.fromEcrRepository(repository),
        taskDefinition: taskDefinition,
        environment: {
            EULA: 'TRUE'
        }
    });

    containerDefinition.addPortMappings({
        containerPort: 25565,
        protocol: ecs.Protocol.TCP
    });

    const securityGroup = new ec2.SecurityGroup(props.context, 'SecurityGroup', {
        vpc: props.vpc,
        securityGroupName: 'ecs-sg'
    });

    securityGroup.addIngressRule(
        ec2.Peer.ipv4('0.0.0.0/0'),
        ec2.Port.tcp(25565)
    );

    const service = new ecs.FargateService(props.context, 'EcsFargateService', {
        cluster: cluster,
        taskDefinition: taskDefinition,
        assignPublicIp: true,
        securityGroup: securityGroup,
        vpcSubnets: props.vpc.selectSubnets({
            subnetType: ec2.SubnetType.PUBLIC
        })
    });
};

export default RecipesEcsFargate;
