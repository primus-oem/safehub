package main

import (
	"os"
	"io/ioutil"
)

func main() {
	// Preload Cedar policies for company isolation and manager access
	_ = ioutil.WriteFile("/policies/company_isolation.cedar", []byte(`
permit(
  principal: User,
  action: "view",
  resource: Document
) when {
  principal.company_id == resource.company_id
};
`), 0644)
	_ = ioutil.WriteFile("/policies/manager_access.cedar", []byte(`
permit(
  principal: User,
  action: "view_report",
  resource: Report
) when {
  principal.role == "manager"
};
`), 0644)
	os.Exit(0)
}
