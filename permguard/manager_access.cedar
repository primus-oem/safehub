permit(
  principal: User,
  action: "view_report",
  resource: Report
) when {
  principal.role == "manager"
};
