const core = require('@actions/core');
const github = require('@actions/github');;

async function start(){
    try {
        const label = core.getInput('label');
        const targetRepo = core.getInput('targetRepo', {required: true});
        const ghToken = core.getInput('token', {required: true});
        const labelArr = core.getInput('addLabel').split(',').map(label => label.trim());
        const assignToArr = core.getInput('assignTo').split(',').map(assignee => assignee.trim());


        const octokit = new github.getOctokit(ghToken);
        const originalIssue = await getOriginalIssue(octokit);

        if (!hasLabel(label, originalIssue)){
            console.log(`Label ${label} not present. Will not copy issue`);
            return;
        }
        
        const clonedIssue = await cloneIssue(octokit, targetRepo, originalIssue, labelArr, assignToArr);

        await addComment(octokit, originalIssue, clonedIssue);
        
        core.setOutput('issue_url', clonedIssue.data.html_url);  
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

async function cloneIssue(octokit, targetRepo, original, labelArr, assignToArr) {
    const splitted = targetRepo.split('/');
    const owner = splitted[0];
    const repoName = splitted[1];
    
    const issueRegex = /(?<=^|\s)#\d+(?=\s|$)/g; // #12 as a word in the text
    let body = original.data.body.replace(issueRegex, (match) => {
        const issueNumber = match.substr(1);
        return `https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/issues/${issueNumber}`;
    });

    body = `Issue cloned from ${original.data.html_url}\n\n${body}`;

    const title = original.data.title;
    const result = await octokit.rest.issues.create({
        owner: owner,
        repo: repoName,
        body: body,
        title: title
    });

    if (labelArr.length > 0) {
        await octokit.rest.issues.addLabels({
            owner: owner,
            repo: repoName,
            issue_number: result.data.number,
            labels: labelArr
        });
    }
    
    if (assignToArr.length > 0) {
        await octokit.rest.issues.addAssignees({
            owner: owner,
            repo: repoName,
            issue_number: result.data.number,
            assignees: assignToArr
        });
    }
    
    return result;
}

async function addComment(octokit, originalIssue, clonedIssue){
    const result = await octokit.rest.issues.createComment({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: originalIssue.data.number,
        body: `Issue cloned to ${clonedIssue.data.html_url}`
    })
    return result;
}

function hasLabel(label, issue){
    const labels = issue.data.labels;
    for(let l of labels){
        if(label === l.name){
            return true;
        }
    }
    return false;
}
