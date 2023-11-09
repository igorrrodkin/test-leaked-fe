import Preferences from '@/components/Settings/Preferences/Preferences';

interface Props {
  organisationId: number
}

const OrganisationPreferences: React.FC<Props> = ({ organisationId }) => (
  <Preferences organisationId={organisationId} />);

export default OrganisationPreferences;
