export function repositoriesConverter(
  res: Repository[]
): GetOrgRepositoriesResponse {
  const firstOwner = res[0].owner

  return {
    org: { name: firstOwner.login, avatarUrl: firstOwner.avatar_url },
    repositories: res.map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
    })),
  }
}
