# Real-account RBAC provisioning proposal

No real administrator accounts are provisioned by source code. Provisioning must
use a verified login address and a secret delivered outside the repository.

| Person | Proposed role | Proposed access | Status |
| --- | --- | --- | --- |
| Bina Babu | `ADMIN` | All implemented management functions | Confirm login identity and initial provisioning method |
| Baldev | `STAFF` | Finance read and finance management only | Requires granular permissions before provisioning |
| Dr. Pa Biromeni | Unassigned | Unassigned | Management domain approval required |
| Ajit | Unassigned | Unassigned | Management domain approval required |
| Thombal | Unassigned | Unassigned | Management domain approval required |

The present schema has only `ADMIN`, `TRUSTEE`, `STAFF`, and `MEMBER`; role checks
cannot safely express finance-only or independent limited access. Before any of
the last four accounts are granted management access, approve a permission matrix
and introduce a reviewed migration for permissions and user permission assignments.
