const core = require('@actions/core');
const github = require('@actions/github');;

async function start(){
    try {
        const label = core.getInput('label');
        if (!hasLabel(label)){
            console.log(`Label ${label} not present. Will not copy issue`)
            return;
        }
        const targetRepo = core.getInput('targetRepo', {required: true});
        const ghToken = core.getInput('token', {required: true});

        const octokit = new github.getOctokit(ghToken);
        const originalIssue= getOriginalIssue(octokit);
        const clonedIssue = cloneIssue(octokit, targetRepo, originalIssue)
        
        addComment(originalIssue, clonedIssue)
        
        console.log(`Issue cloned successfully`);      
      } catch (error) {
        core.setFailed(error.message);
      }
}


start();

async function getOriginalIssue(octokit) {
    const payloadIssue = github.context.payload.issue;
    if (!payloadIssue){
        throw new Error("No issue in context");
    }
    const issue = await octokit.rest.issues.get({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: payloadIssue.number    
    })

    return issue;
}

async function cloneIssue(octokit, targetRepo, original){
    const splitted = targetRepo.split('/');
    const owner = splitted[0];
    const repoName = splitted[1];
    
    const title = original.title;
    const body = `Issue cloned from ${original.data.html_url}\n\n${original.data.body}`;

    const result = await octokit.rest.issues.create({
        owner: owner,
        repo: repoName,
        body: body,
        title: title,
        label: original.labels
    });
    return result;
}

async function addComment(octokit, originalIssue, clonedIssue){
    const result = await octokit.rest.issues.createComment({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: originalIssue.number,
        body: `Issue cloned to ${clonedIssue.data.html_url}`
    })
    return result;
}