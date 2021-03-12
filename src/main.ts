import core from '@actions/core';
import github, { getOctokit } from '@actions/github';

const main = async () => {
    const stdin = process.openStdin();

    let auditJson = "";

    stdin.on('data', (chunk: string): void => {
        auditJson += chunk;
    });

    stdin.on('end', async (): Promise<void> => {
        console.log(auditJson);
        const jsonAudit = JSON.parse(auditJson);

        const message = `
        ============== NPM Audit Report ==============

        Total Dependencies Scanned: ${jsonAudit.metadata.totalDependencies}
        Critical: $(jq '.metadata.vulnerabilities.critical' npm-audit.json)
        High: $(jq '.metadata.vulnerabilities.high' npm-audit.json)
        Moderate: $(jq '.metadata.vulnerabilities.moderate' npm-audit.json)
        Low: $(jq '.metadata.vulnerabilities.low' npm-audit.json)
        
        Critical -
        $(jq '.advisories[] | select(.severity | . == "critical") | .module_name + " | " + .recommendation' npm-audit.json)
        
        High - 
        $(jq '.advisories[] | select(.severity | . == "high") | .module_name + " | " + .recommendation' npm-audit.json)
        
        Moderate -
        $(jq '.advisories[] | select(.severity | . == "moderate") | .module_name + " | " + .recommendation' npm-audit.json)
        
        `;
        const github_token = core.getInput('GITHUB_TOKEN');

        const context = github.context;
        if (context.payload.pull_request == null) {
            core.setFailed('No pull request found.');
            return;
        }
        const pull_request_number = context.payload.pull_request.number;
        
        await createCommentOnPr(context.repo, pull_request_number, message, github_token);
    });
}

const createCommentOnPr = async (repoContext: { owner: string, repo: string }, prNumber: number, message: string, token: string) => {
    try {
        const octokit = getOctokit(token);

        await octokit.issues.createComment({
            ...repoContext,
            issue_number: prNumber,
            body: message
        });

    } catch (error) {
        core.setFailed(error.message);
    }
}

main();