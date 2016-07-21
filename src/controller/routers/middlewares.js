import { User, Repo, Project, UserProject } from '../../model';
export function* mergeParams(next) {
  this.param = {
    ...this.query,
    ...this.params,
    ...this.request.body,
  };

  yield next;
}

export function* responder(next) {
  try {
    yield next;
    const { respond, page } = this.state;
    const body = { data: respond, page };
    this.body = {
      res: true,
      ...body,
    };
  } catch (e) {
    this.body = {
      ret: false,
      status: e.status || 500,
      message: e.stack || '服务器错误',
    };
    // this.app.emit('error', e, this);
    return;
  }
}

export function* pagination(next) {
  if (isNaN(+this.param.currentPage)) {
    throw new Error('分页接口必须传入 currentPage 参数！');
  }

  this.param.currentPage = +this.param.currentPage;
  this.param.pageSize = +this.param.pageSize || 10;

  const { currentPage, pageSize } = this.param;
  this.state.page = {
    currentPage,
    pageSize,
    totalCount: 0,
  };
  this.state.pageMixin = {
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
  };
  yield next;
}

export function* getCurrentUser(next) {
  this.state.user = {
    userId: 2,
  };
  const { projectId } = this.param;

  if (projectId) {
    const isBelongToMembers = yield UserProject.findOne({
      where: {
        userId: this.state.user.userId,
        projectId,
      },
    });
    if (!isBelongToMembers) throw new Error('没有权限');
  }

  yield next;
}

export function* isProjectOwner(next) {
  const { projectId } = this.param;
  this.state.user.isProjectOwner = false;
  if (!isNaN(projectId)) {
    const ownerId = yield Project.findOne({
      attributes: ['owner'],
      where: { id: projectId },
    });
    this.state.user.isProjectOwner = this.state.user.userId === ownerId.owner;
    this.state.user.ownerId = ownerId.owner;
  }
  yield next;
}

export function* isRepoOwner(next) {
  const { repoId } = this.param;
  let repoOwner = false;
  if (!isNaN(repoId)) {
    const ownerId = yield Repo.findOne({
      attributes: ['admin'],
      where: { id: repoId },
    });
    repoOwner = this.state.user.userId === ownerId.admin;
  }
  if (!repoOwner) throw new Error('非大库管理员，没有权限');
  yield next;
}

export function* isAdmin(next) {
  const { userId } = this.state.user;
  let admin = false;
  if (!isNaN(userId)) {
    const actor = yield User.findOne({
      attributes: ['actor'],
      where: { id: userId },
    });
    admin = actor.actor === 2;
  }
  if (!admin) throw new Error('非超管，没有权限');
  yield next;
}