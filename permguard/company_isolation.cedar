permit(
  principal: User,
  action: "view",
  resource: Document
) when {
  principal.company_id == resource.company_id
};
