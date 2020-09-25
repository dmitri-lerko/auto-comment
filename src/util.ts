import * as core from '@actions/core'
import * as github from '@actions/github'
import random from 'lodash.random'
import template from 'lodash.template'
import camelCase from 'lodash.camelcase'

export namespace Util {
  export function getOctokit() {
    const token = core.getInput('GITHUB_TOKEN', { required: true })
    return github.getOctokit(token)
  }

  export function pickComment(
    comment: string | string[],
    args?: { [key: string]: string },
  ) {
    let result: string
    if (typeof comment === 'string' || comment instanceof String) {
      result = comment.toString()
    } else {
      const pos = random(0, comment.length, false)
      result = comment[pos] || comment[0]
    }

    return args ? template(result)(args) : result
  }

  const eventTypes = {
    issues: [
      'opened',
      'edited',
      'deleted',
      'transferred',
      'pinned',
      'unpinned',
      'closed',
      'reopened',
      'assigned',
      'unassigned',
      'labeled',
      'unlabeled',
      'locked',
      'unlocked',
      'milestoned',
      'demilestoned',
    ],
    pull_request: [
      'assigned',
      'unassigned',
      'labeled',
      'unlabeled',
      'opened',
      'edited',
      'closed',
      'reopened',
      'synchronize',
      'ready_for_review',
      'locked',
      'unlocked',
      'review_requested',
      'review_request_removed',
    ],
  }

  export function getComment() {
    const context = github.context
    const event = context.eventName
    const action = context.payload.action as string
    const actions = (eventTypes as any)[event] as string[]

    if (actions.includes(action)) {
      const eventName = camelCase(`${event}.${action}`)
      return core.getInput(eventName)
    }

    return null
  }
}